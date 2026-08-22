import { NextResponse } from "next/server";

import { prisma } from "@/lib/server/prisma";

export async function POST(request) {

    try {

        const body =
            await request.json();

        const {
            transactionId,
            formId,
            operation,
            payload,
        } = body;


        /*
        |--------------------------------------------------------------------------
        | Validate Request
        |--------------------------------------------------------------------------
        */

        if (
            !transactionId ||
            !formId ||
            !payload
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid sync payload.",
                },
                {
                    status: 400,
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Check Existing Form
        |--------------------------------------------------------------------------
        */

        const existingForm =
            await prisma.form.findUnique({

                where: {
                    formId,
                },

            });


        /*
        |--------------------------------------------------------------------------
        | Create Or Update
        |--------------------------------------------------------------------------
        */

        let serverRecord;


        if (existingForm) {

            serverRecord =
                await prisma.form.update({

                    where: {
                        formId,
                    },

                    data: {

                        transactionId,

                        data:
                            JSON.stringify(
                                payload
                            ),

                        status:
                            "synced",

                    },

                });

        } else {

            serverRecord =
                await prisma.form.create({

                    data: {

                        formId,

                        transactionId,

                        data:
                            JSON.stringify(
                                payload
                            ),

                        status:
                            "synced",

                    },

                });

        }


        /*
        |--------------------------------------------------------------------------
        | Server Confirmation
        |--------------------------------------------------------------------------
        */

        return NextResponse.json({

            success: true,

            message:
                "Form synchronized successfully.",

            transactionId,

            serverId:
                serverRecord.id,

            formId,

            syncedAt:
                serverRecord.updatedAt,

        });

    } catch (error) {

        console.error(
            "Server sync error:",
            error
        );


        return NextResponse.json(

            {
                success: false,

                message:
                    "Server synchronization failed.",
            },

            {
                status: 500,
            }

        );

    }
}