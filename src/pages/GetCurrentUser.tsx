const { data } = await supabase.auth.getUser();
const user = data.user;