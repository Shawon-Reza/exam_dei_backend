/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloudinaryDeleteByUrl } from "../../config/multer";
import { slugify } from "../../config/slugify";
import { prisma } from "../../lib/prisma";



const getAllSubjects = async () => {
    const [data, count] = await Promise.all([
        prisma.subject.findMany({
            orderBy: {
                sortOrder: "asc",
            },
        }),
        prisma.subject.count(),
    ]);

    return {
        count,
        data,
    };
};

const createSubject = async (data: any, file?: any) => {
    try {
        console.log("Creating subject with data:", data, "and file:", file);
        // Generate slug from both names


        if (!data.slug) {
            const slugSource = [data.name, data.banglaName]
                .filter((name) => name?.trim())
                .join(" ");

            const slug = slugify(slugSource);
            data.slug = slug;
        }

        const result = await prisma.subject.create({
            data: {
                name: data.name,
                banglaName: data.banglaName,
                slug: data.slug,
                icon: file ? file.path : null,
                description: data.description,
                sortOrder: data.sortOrder,
                isActive: data.isActive,
            },
        });
        return result;

    } catch (error) {

        await cloudinaryDeleteByUrl(file?.path);


        const message =
            error instanceof Error ? error.message : String(error);

        throw new Error(`Failed to create subject: ${message}`, {
            cause: error,
        });
    }
}



const updateSubjectByID = async (id: string, data: any, file?: any) => {
    try {
        console.log("Updating subject with ID:", id, "data:", data, "file:", file);

        const result = await prisma.subject.update({
            where: {
                id: id,
            },
            data: {
                name: data.name,
                banglaName: data.banglaName,
                slug: data.slug,
                icon: file ? file.path : null,
                description: data.description,
                sortOrder: data.sortOrder,
                isActive: data.isActive,
            },
        });
        console.log("Updated subject result:", result);

        return result;
    } catch (error) {
        await cloudinaryDeleteByUrl(file?.path);
        const message =
            error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to update subject: ${message}`, {
            cause: error,
        });
    }
}

const deleteSubjectByID = async (id: string) => {
    const result = await prisma.subject.delete({
        where: {
            id: id,
        },
    });
    return result;
}


const subjectStatusbyID = async (id: string, status: boolean) => {
    const result = await prisma.subject.update({
        where: {
            id: id,
        },
        data: {
            status: status,
        },
    });
    return result;
};

export const subjectService = {
    getAllSubjects,
    createSubject,
    updateSubjectByID,
    deleteSubjectByID,
    subjectStatusbyID

}