import React, { Fragment } from "react";
import useDataGetter from "./hooks/useDataGetter";
const App = () => {
  const postData = { title: "post 4" };
  const newData = { title: "new title" };
  const {
    data: dataGet,
    error: errorGet,
    loading: loadingGet,
    request: requestGet,
    fetchData: get,
  } = useDataGetter("posts", "get", false, null);

  const {
    data: dataPost, // new Data
    error: errorPost,
    loading: loadingPost,
    request: requestPost,
    fetchData: post,
  } = useDataGetter("posts", "post", false, null);

  const {
    data: dataDelete, // new Data
    error: errorDelete,
    loading: loadingDelete,
    request: requestDelete,
    fetchData: remove,
  } = useDataGetter("posts", "delete", false, null);

  const {
    data: dataPut, // new Data
    error: errorPut,
    loading: loadingPut,
    request: requestPut,
    fetchData: put,
  } = useDataGetter("posts", "put", false, null);

  return (
    <Fragment>
      <button onClick={get}>fetch data get</button>
      <button onClick={() => post(postData)}>fetch data post</button>
      {(loadingGet || loadingPost || loadingDelete || loadingPut) &&
        (!errorGet || !errorPost || !errorDelete || !errorPut) && (
          <h2 style={{ color: "orange" }}>Loading...</h2>
        )}
      {(errorGet || errorPost || errorDelete || errorPut) && (
        <h2 style={{ color: "red" }}>
          {errorGet || errorPost || errorDelete || errorPut}
        </h2>
      )}

      <div>
        {!dataGet.length &&
        (requestGet || requestPost || requestDelete || requestPut) ? (
          <div>empty</div>
        ) : (
          dataGet.map((item) => (
            <div style={{ margin: "20px" }} key={item.id}>
              id (delete) :{" "}
              <b onClick={() => remove(null, item.id)}>{item?.id}</b>{" "}
              {/* click for delete with id */}
              <br />
              title (put) :{" "}
              <span onClick={() => put(newData, item.id)}>
                {item?.title}
              </span>{" "}
              {/* click for update title to new title */}
            </div>
          ))
        )}
      </div>
    </Fragment>
  );
};

export default App;
