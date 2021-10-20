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
    fetchDataGet,
  } = useDataGetter("posts", "get", false, null, null);

  const {
    error: errorPost,
    loading: loadingPost,
    request: requestPost,
    fetchDataPost,
  } = useDataGetter("posts", "post", false, postData, null);

  const {
    error: errorDelete,
    loading: loadingDelete,
    request: requestDelete,
    fetchDataDelete,
  } = useDataGetter("posts", "delete", false, null, null);

  const {
    error: errorPut,
    loading: loadingPut,
    request: requestPut,
    fetchDataPut,
  } = useDataGetter("posts", "put", false, newData, null);

  return (
    <Fragment>
      <button onClick={fetchDataGet}>fetch data get</button>
      <button onClick={fetchDataPost}>fetch data post</button>
      {(loadingGet || loadingPost || loadingDelete || loadingPut) &&
        (!errorGet || errorPost || errorDelete || errorPut) && (
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
              <b onClick={() => fetchDataDelete(item.id)}>{item?.id}</b>{" "}
              {/* click for delete with id */}
              <br />
              title (put) :{" "}
              <span onClick={() => fetchDataPut(item.id)}>
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
