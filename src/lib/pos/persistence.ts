import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const businessId = () => process.env.VESPER_BUSINESS_ID?.trim() || "demo";

const tableSchema = z.object({
  id: z.string().min(1),
  number: z.string().min(1).max(32),
  roomId: z.string().min(1),
  seats: z.number().int().min(1).max(100),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  w: z.number().positive().max(100),
  h: z.number().positive().max(100),
  rotation: z.number().min(-360).max(360),
  shape: z.enum(["rect", "round", "oval"]),
});

export const saveTableLayout = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof tableSchema>) => tableSchema.parse(data))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into pos_business (id, name) values ($1, $2) on conflict (id) do nothing`,
      [businessId(), "Vesper"],
    );
    await sql.query(
      `insert into pos_rooms (id, business_id, name)
       values ($1, $2, $1)
       on conflict (id) do nothing`,
      [data.roomId, businessId()],
    );
    await sql.query(
      `insert into pos_tables (id, business_id, room_id, number, seats, x, y, w, h, rotation, shape, updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now())
       on conflict (id) do update set
         room_id=excluded.room_id, number=excluded.number, seats=excluded.seats,
         x=excluded.x, y=excluded.y, w=excluded.w, h=excluded.h,
         rotation=excluded.rotation, shape=excluded.shape, updated_at=now()`,
      [data.id, businessId(), data.roomId, data.number, data.seats, data.x, data.y, data.w, data.h, data.rotation, data.shape],
    );
    return { ok: true };
  });

export const saveTableLayouts = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof tableSchema>[]) => z.array(tableSchema).max(500).parse(data))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`insert into pos_business (id, name) values ($1, $2) on conflict (id) do nothing`, [businessId(), "Vesper"]);
    for (const table of data) {
      await sql.query(`insert into pos_rooms (id, business_id, name) values ($1,$2,$1) on conflict (id) do nothing`, [table.roomId, businessId()]);
      await sql.query(`insert into pos_tables (id,business_id,room_id,number,seats,x,y,w,h,rotation,shape,updated_at)
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now())
        on conflict (id) do update set room_id=excluded.room_id,number=excluded.number,seats=excluded.seats,x=excluded.x,y=excluded.y,w=excluded.w,h=excluded.h,rotation=excluded.rotation,shape=excluded.shape,active=true,updated_at=now()`,
        [table.id,businessId(),table.roomId,table.number,table.seats,table.x,table.y,table.w,table.h,table.rotation,table.shape]);
    }
    return { ok: true, count: data.length };
  });

export const deleteTablePersisted = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`update pos_tables set active=false, updated_at=now() where id=$1 and business_id=$2`, [data.id, businessId()]);
    return { ok: true };
  });

export const listPersistedTables = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{
    id: string; number: string; room_id: string; seats: number; x: string; y: string; w: string; h: string; rotation: string; shape: "rect" | "round" | "oval";
  }>(`select id, number, room_id, seats, x, y, w, h, rotation, shape from pos_tables where business_id=$1 and active=true order by room_id, number`, [businessId()]);
  return rows.map((r) => ({ id: r.id, number: r.number, roomId: r.room_id, seats: Number(r.seats), x: Number(r.x), y: Number(r.y), w: Number(r.w), h: Number(r.h), rotation: Number(r.rotation), shape: r.shape }));
});
