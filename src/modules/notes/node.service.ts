/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma"



const getNote = async (topicID: string) => {
    const result = await prisma.note.findFirst({
        where: {
            topicId: topicID
        }
    })

    if (!result) {
        throw new Error("Note not found")
    }

    return result
}


const createNote = async (payload: any) => {
    const { topicId } = payload
    console.log("Creating note for topicID:", topicId, "with payload:", payload);

    const NoteExist = await prisma.note.findFirst({
        where: {
            topicId: topicId
        }
    })

    if (NoteExist) {
        throw new Error("Note already exists")
    }

    const result = await prisma.note.create({
        data: payload
    })

    return result
}

const updateNoteById = async (payload: any) => {
    const { topicId } = payload
    // console.log("Updating note for topicID:", topicId, "with payload:", payload);

    const NoteExist = await prisma.note.findFirst({
        where: {
            topicId: topicId
        }
    })
    if (!NoteExist) {
        throw new Error("Note not found")
    }

    const result = await prisma.note.update({
        where: {
            id: NoteExist.id
        },
        data: payload
    })

    return result
}


export const noteService = {
    getNote,
    createNote,
    updateNoteById,
}