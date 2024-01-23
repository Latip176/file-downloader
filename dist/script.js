const params = new URLSearchParams(window.location.search);
search = params.get('keywords');
page = params.get("page") !== null ? params.get("page") : 1;
const item = document.querySelector(".content");
const loader = document.querySelector(".load");

const showLoad = () => {
    loader.style.visibility = "visible";
}
const hiddeLoad = () => {
    loader.style.visibility = "hidden";
}

async function next(num) {
    window.location.href = `?keywords=${search}&page=${Number(page) + 1}`;
}

async function getDownload(id) {
    try {
        const response = await fetch('https://sfile-api.vercel.app/download/' + id);
        const data = await response.json();
        return data['data'].url;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function fetchData() {
    showLoad();
    try {
        const response = await fetch('https://sfile-api.vercel.app/search/' + search + `&page=${page}`);
        if (!response.ok) {
            throw new Error('Gagal mengambil data. Status: ' + response.status);
        }
        const data = await response.json();
        
        if(data['data'].data.length == 0) {
            const warning = document.createElement("p");
            const container = document.querySelector(".results")
            warning.className = "warning";
            warning.innerHTML = "File Not Found :(";
            container.appendChild(warning);
        }

        await Promise.all(data['data'].data.map(async (d) => {
            const div = document.createElement("div");
            const href = await getDownload(d.id);
            div.className = "item";
            div.innerHTML = `
                <div class="item">
                    <div>
                        <img src="${d.icon}" alt="Icon File" class="icon">
                        <p class="title"><a href="${href}" download>${d.title}</a></p>
                        <p class="size">Size: ${d.size}</p>
                    </div>
                </div>
            `;
            item.appendChild(div);
            hiddeLoad();
        }));

        if (data['data'].next != null) {
            const container = document.querySelector(".container");
            const pagination = document.createElement("div");
            pagination.className = "pagination";
            container.appendChild(pagination)
            pagination.innerHTML = `<a onclick="next(1)">Next >></a>`;
        }
    } catch (error) {
        console.error(error);
    }
}

if (search !== null) {
    fetchData();
}