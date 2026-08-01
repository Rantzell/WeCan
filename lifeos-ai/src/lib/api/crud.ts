import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

// A small factory that turns a Supabase table into REST route handlers.
// Enforces auth + RLS (user_id is always stamped from the session).
export function crudHandlers(table: string, opts?: { orderBy?: string }) {
  async function requireUser() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { supabase, user };
  }

  const notConfigured = () =>
    NextResponse.json(
      { error: "Supabase not configured", demo: true, data: [] },
      { status: 200 }
    );

  return {
    // GET /api/<table>
    async GET() {
      if (!isSupabaseConfigured()) return notConfigured();
      const { supabase, user } = await requireUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      let query = supabase.from(table).select("*").eq("user_id", user.id);
      if (opts?.orderBy) query = query.order(opts.orderBy, { ascending: false });

      const { data, error } = await query;
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data });
    },

    // POST /api/<table>  — create
    async POST(req: Request) {
      if (!isSupabaseConfigured()) return notConfigured();
      const { supabase, user } = await requireUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const body = await req.json();
      const { data, error } = await supabase
        .from(table)
        .insert({ ...body, user_id: user.id })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data }, { status: 201 });
    },

    // PATCH /api/<table>?id=… — update
    async PATCH(req: Request) {
      if (!isSupabaseConfigured()) return notConfigured();
      const { supabase, user } = await requireUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const id = new URL(req.url).searchParams.get("id");
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

      const body = await req.json();
      delete body.user_id;
      const { data, error } = await supabase
        .from(table)
        .update(body)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data });
    },

    // DELETE /api/<table>?id=…
    async DELETE(req: Request) {
      if (!isSupabaseConfigured()) return notConfigured();
      const { supabase, user } = await requireUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const id = new URL(req.url).searchParams.get("id");
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    },
  };
}
