import { supabase } from "../supabaseClient"

export const getMedia = (mediaId) => {
    return `https://myzwukslktjvjnsckhhh.supabase.co/storage/v1/object/public/media/${mediaId}`
}

function extractFileNameFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

export const removeMedia = async (mediaId) => {
    const { delData, delError } = await supabase
        .storage
        .from('media')
        .remove([`${extractFileNameFromUrl(mediaId)}`])
    if (delError) return delError
    console.log(delData || delError);
}

export const postMedia = async (e, mediaId, prevMediaId) => {
    const file = e.target.files[0]
    const { uplData, uplError } = await supabase
        .storage
        .from("media")
        .upload(`${mediaId}`, file)
    removeMedia(prevMediaId)
    if (uplError) return uplError
    console.log(uplData || uplError);
}
