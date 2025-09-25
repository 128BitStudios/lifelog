import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try to fetch the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to fetch profile", details: profileError.message },
        { status: 500 }
      );
    }

    // If no profile exists, create one
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          first_name: "",
          last_name: "",
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { error: "Failed to create profile", details: createError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        data: {
          id: newProfile.id,
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          date_of_birth: newProfile.date_of_birth,
          gender: newProfile.gender,
          location: newProfile.location,
          created_at: newProfile.created_at,
          updated_at: newProfile.updated_at,
        }
      });
    }

    return NextResponse.json({
      data: {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        location: profile.location,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { first_name, last_name, date_of_birth, gender, location } = body;

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Update the user's profile
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name,
        last_name,
        date_of_birth: date_of_birth || null,
        gender: gender || null,
        location: location || null,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update profile", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        location: profile.location,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}