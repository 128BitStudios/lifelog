import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    // Parse query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Expected format: YYYY-MM-DD

    let query = supabase
      .from("time_blocks")
      .select("*")
      .eq("user_id", user.id)
      .order("time_block", { ascending: true });

    // If date is provided, filter by that specific date
    if (date) {
      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;
      query = query.gte("time_block", startOfDay).lte("time_block", endOfDay);
    }

    const { data: timeBlocks, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch time blocks", details: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: timeBlocks || []
    });

  } catch (error) {
    console.error("Error fetching time blocks:", error);
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
    const { time_block, description } = body;

    // Validate required fields
    if (!time_block) {
      return NextResponse.json(
        { error: "Time block is required" },
        { status: 400 }
      );
    }

    // Validate time_block format (should be ISO string)
    const timeBlockDate = new Date(time_block);
    if (isNaN(timeBlockDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid time block format. Use ISO string format." },
        { status: 400 }
      );
    }

    // Insert or update the time block (upsert)
    const { data: timeBlock, error: upsertError } = await supabase
      .from("time_blocks")
      .upsert({
        user_id: user.id,
        time_block: time_block,
        description: description || null,
      }, {
        onConflict: 'user_id,time_block'
      })
      .select()
      .single();

    if (upsertError) {
      return NextResponse.json(
        { error: "Failed to save time block", details: upsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        id: timeBlock.id,
        user_id: timeBlock.user_id,
        time_block: timeBlock.time_block,
        description: timeBlock.description,
        created_at: timeBlock.created_at,
        updated_at: timeBlock.updated_at,
      },
      message: "Time block saved successfully"
    });

  } catch (error) {
    console.error("Error saving time block:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const timeBlockId = searchParams.get('id');

    if (!timeBlockId) {
      return NextResponse.json(
        { error: "Time block ID is required" },
        { status: 400 }
      );
    }

    // Delete the time block
    const { error: deleteError } = await supabase
      .from("time_blocks")
      .delete()
      .eq("id", timeBlockId)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete time block", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Time block deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting time block:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}