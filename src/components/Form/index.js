import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_BOOK_DETAIL, NEW_BOOK, UPDATE_BOOK } from "gql/books";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Form(props) {
    const navigate = useNavigate();
    const params = useParams();

    const [newBook, { loading: loadingNewBook, error: errorNewBook }] =
        useMutation(NEW_BOOK);

    const [updateBook, { loading: loadingUpdateBook, error: errorUpdateBook }] =
        useMutation(UPDATE_BOOK);

    const [
        getBookDetail,
        { loading: loadingBook, error: errorBook, data: dataBook },
    ] = useLazyQuery(GET_BOOK_DETAIL, {
        variables: { _id: params.id },
    });
    async function onSubmit(event) {
        event.preventDefault();
        console.dir(event);

        const payload = {};

        for (let index = 0; index < event.target.length; index++) {
            const element = event.target[index];
            if (element.nodeName === "INPUT") {
                payload[element.name] = element.value;
            }
        }

        if (params.id) {
            try {
                const resp = await updateBook({
                    variables: {
                        ...payload,
                        _id: params.id,
                        release_year: Number(payload.release_year),
                    },
                });

                if (resp) navigate("/books");
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const resp = await newBook({
                    variables: {
                        ...payload,
                        release_year: Number(payload.release_year),
                    },
                });

                if (resp) navigate("/books");
            } catch (error) {
                console.error(error);
            }
        }
    }

    React.useEffect(() => {
        if (params.id) getBookDetail();
    }, [params.id, getBookDetail]);

    React.useEffect(() => {
        if (dataBook) {
            const form = document.getElementById("form-book");

            for (let index = 0; index < form.length; index++) {
                const element = form[index];

                if (element.nodeName === "INPUT")
                    element.value = dataBook.getBook[element.name];
            }
        }
    }, [dataBook]);

    if (params.id && loadingBook) return "Loading...";

    if (errorNewBook || errorBook || errorUpdateBook)
        return "Something goes wrong on our Server";

    return (
        <div>
            <h1>
                <Link to="/books" style={{ fontSize: 12 }}>
                    {"<- Back"}
                </Link>{" "}
                Form penambahan buku
            </h1>
            <form id="form-book" style={{ maxWidth: 500 }} onSubmit={onSubmit}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="author">Author:</label>
                    <input type="text" id="author" name="author" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="description">Description:</label>
                    <input type="text" id="description" name="description" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="release_year">Release Year:</label>
                    <input
                        type="number"
                        id="release_year"
                        name="release_year"
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="genre">Genre:</label>
                    <input type="text" id="genre" name="genre" />
                </div>

                <button type="button" onClick={() => navigate("/books")}>
                    Back
                </button>
                <button type="submit">Save</button>
            </form>
        </div>
    );
}
