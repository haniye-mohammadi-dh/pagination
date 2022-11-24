import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Pagination, Table } from "react-bootstrap";

function App() {
  const [todos, setTodos] = useState([]);
  const [paginate, setPaginate] = useState([]);
  const [page, setPage] = useState(1);
  const getTodos = async () => {
    try {
      const { data } = await axios(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTodos(data);
      const help = [];
      for (let index = 0; index < data.length / 20; index++) {
        help.push(index + 1);
      }
      setPaginate(help);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getTodos();
  }, []);
  useEffect(() => {
    const help = [];
    for (let index = 0; index < todos.length / 20; index++) {
      help.push(index + 1);
    }
    setPaginate(help);
  }, [todos]);
  const show = useMemo(() => {
    return todos.slice((page - 1) * 20, page * 20);
  }, [page, todos]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);
  useEffect(() => {
    if (!show.length && page > 1) {
      setPage((last) => last - 1);
    }
  }, [todos]);
  return (
    <div className="App">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>id</th>
            <th>title</th>
            <th>completed</th>
          </tr>
        </thead>
        <tbody>
          {show.map((item, index) => {
            return (
              <tr key={item.id}>
                <td
                  onClick={() => {
                    setTodos((last) => {
                      const help = JSON.parse(JSON.stringify(last));
                      help.splice((page - 1) * 20 + index, 1);
                      return [...help];
                    });
                  }}
                >
                  {index}
                </td>
                <td>{item.id}</td>
                <td
                style={{color:index%2?"blue":"pink"
                }}
                >{item.title}</td>
                <td
                style={{color:item.completed?"green":"red"}}
                  onClick={() => {
                    setTodos((last) => {
                      const help = JSON.parse(JSON.stringify(last));
                      help[(page - 1) * 20 + index].completed =
                        !help[(page - 1) * 20 + index].completed;
                      return [...help];
                    });
                  }}
                >
                  {item.completed.toString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First
          onClick={() => {
            page === 1 ? window.scrollTo({ top: 0 }) : setPage(1);
          }}
        />
        <Pagination.Prev
          onClick={() => {
            page === 1
              ? window.scrollTo({ top: 0 })
              : setPage((last) => last - 1);
          }}
        />
        {paginate.map((item, index) => {
          return (
            <Pagination.Item
              key={index}
              active={page === item}
              onClick={() => {
                setPage(item);
              }}
            >
              {item}
            </Pagination.Item>
          );
        })}
        <Pagination.Next
          onClick={() => {
            page === paginate[paginate.length - 1]
              ? window.scrollTo({ top: 0 })
              : setPage((last) => last + 1);
          }}
        />
        <Pagination.Last
          onClick={() => {
            page === paginate[paginate.length - 1]
              ? window.scrollTo({ top: 0 })
              : setPage(paginate[paginate.length - 1]);
          }}
        />
      </Pagination>
    </div>
  );
}

export default App;
