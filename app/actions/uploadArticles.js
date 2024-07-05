'use server'
export async function uploadToBlog(englishArticle, frenchArticle) {
    console.log('English Article:', englishArticle);
    console.log('French Article:', frenchArticle);

    return {
        englishArticle,
        frenchArticle,
    };
}