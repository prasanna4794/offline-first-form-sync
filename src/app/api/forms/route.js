import {
    createForm,
    getForms
} from "@/lib/server/formService";

export async function GET() {

    try {

        const forms = await getForms();

        return Response.json({
            success: true,
            data: forms
        });

    } catch (error) {

        console.error(
            "GET /api/forms error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to fetch forms"
            },
            {
                status: 500
            }
        );
    }
}

export async function POST(request) {

    try {

        const body = await request.json();

        const form = await createForm(body);

        return Response.json(
            {
                success: true,
                data: form
            },
            {
                status: 201
            }
        );

    } catch (error) {

        console.error(
            "POST /api/forms error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to create form"
            },
            {
                status: 500
            }
        );
    }
}