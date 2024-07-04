function getHeader(jwt: string) {
    return {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        }
    };
}

export default {
    get_gwin: async function (jwt: string) {
        const url = "http://192.168.0.101/gwin";
        const response = await fetch(url, getHeader(jwt));
        return await response.json();
    }
};
