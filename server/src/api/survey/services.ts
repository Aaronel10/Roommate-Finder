import db from '../../utils/db';

//will be used for matches, gets all questions and responses for all users.
export async function GetAllSurveyQuestionsAndResponses(){
    return await db.question.findMany({
        select: {
            id: true,
            question_text: true,
            response: true,
            ResponsesOnUsers: {
                select: {
                    responseId: true,
                    response: true
                }
        }
        },
    })
}

//gets a users questions and responses. 
export async function GetSurveyQuestionsAndResponses(userId: string){
    return await db.question.findMany({
        select: {
            id: true,
            question_text: true,
            response: true,
            ResponsesOnUsers: {
                where: {
                    userId,
                },
                select: {
                    responseId: true,
                    response: true
                }
        }
        },
    })
}

//check if responseID is valid for questionID
export async function VerifyResponse(question_id:string, responseId: string){
    const data = await db.response.findMany({
        where: {
            question_id,
            id: responseId
        }
    })
    if(data.length > 0)
    {
        return true;
    }
    else{
        return false;
    }
}

export async function UserAnswer(userId: string, questionId:string, responseId: string){
    //can't do upsert because something is not unique
    const update = await db.responsesOnUsers.updateMany({
        where: {
            userId,
            questionId,
        },
        data: {
            responseId,
        }
      });

    if(update.count == 0){
        return await db.responsesOnUsers.create({
            data: {
                userId,
                questionId,
                responseId,
            }
        });
    }
    else{
        return update;
    }
}

export async function AddQuestion(question_text: string){
    return await db.question.create({
        data: {
            question_text,
        }
    });
}

export async function RemoveQuestion(id: string){
    await db.response.deleteMany({
        where: {
            question_id: id,
        }
    })
    return await db.question.delete({
        where: {
            id,
        }
    });
}

export async function AddResponse(response: string, question_id: string){
    return await db.response.create({
        data: {
            response,
            question_id,
        }
    });
}

export async function RemoveResponse(id: string){
    return await db.response.delete({
        where: {
            id,
        }
    });
}

export async function VerifySetup(id:string){
    return await db.user.update({
        where: {
            id,
        },
        data: {
            is_setup: true,
        }
    });
}
