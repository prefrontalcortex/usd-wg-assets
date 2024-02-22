/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {

    console.log(params.path);

    return {
        slug: params.path,
    }
}