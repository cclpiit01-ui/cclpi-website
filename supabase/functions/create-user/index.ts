import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const {
      email, password, username, role_id,
      full_name, department, job_position,
      avatar_url, employee_id,
    } = await req.json();

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, full_name, department, job_position, avatar_url, employee_id },
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Update profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        username,
        role_id: role_id || null,
        full_name: full_name || "",
        department: department || "",
        job_position: job_position || "",
        avatar_url: avatar_url || null,
        employee_id: employee_id || null,
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    return new Response(
      JSON.stringify({ success: true, user_id: userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});