import { useMutation, useQuery } from "@apollo/client";
import { DELETE_BOOK, GET_BOOKS } from "gql/books";
import React from "react";
import { Link } from "react-router-dom";

export default function List(props) {
    const [id, setId] = React.useState(null);

    const { loading, error, data } = useQuery(GET_BOOKS, {
        fetchPolicy: "no-cache",
    });

    const [deleteBook, { loading: loadingDeleteBook, error: errorDeleteBook }] =
        useMutation(DELETE_BOOK, {
            refetchQueries: [GET_BOOKS],
            onError: (res) => {
                console.log(res.networkError);
            },
        });

    function fnDelete(_id) {
        setId(_id);
        deleteBook({
            variables: { _id },
        });
    }

    if (loading) return "Loading...";
    if (error) {
        console.log(error);

        // optional chaining
        return error?.graphQLErrors.map((error) => error) ?? error.networkError;
    }

    if (data.getAllBooks.length === 0)
        return (
            <h1>
                Belum ada buku didaftarkan{" "}
                <Link to="/books/new">+ Buat baru</Link>
            </h1>
        );

    return (
        <div>
            <h1>
                List buku
                <Link to="/books/new" style={{ fontSize: 12 }}>
                    + Buat Baru
                </Link>
            </h1>
            <table cellPadding="15" border="1">
                <thead>
                    <tr style={{ fontWeight: "bold", textAlign: "center" }}>
                        <td>#</td>
                        <td>Title</td>
                        <td>Author</td>
                        <td>Description</td>
                        <td>Release Year</td>
                        <td>Genre</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {data.getAllBooks.map((item, index) => {
                        return (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.author}</td>
                                <td>{item.description}</td>
                                <td>{item.release_year}</td>
                                <td>{item.genre}</td>
                                <td>
                                    (
                                    <Link to={`/books/${item._id}/edit`}>
                                        Edit
                                    </Link>
                                    ) (
                                    <span
                                        style={{
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                            color: "blue",
                                        }}
                                        onClick={() => {
                                            fnDelete(item._id);
                                        }}>
                                        {id === item._id && loadingDeleteBook
                                            ? "Deleting..."
                                            : "Delete"}
                                    </span>
                                    )
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
