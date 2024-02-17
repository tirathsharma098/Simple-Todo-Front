import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import "primeflex/primeflex.css";

import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import useHttp from "./hooks/useHttp";
import { apiAddTodo, apiCompleteTask, apiGetTodos } from "./services/todo";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const App = (props) => {
    const {
        response: todoAdded,
        isLoading: isTodoAdding,
        apiFunc: addTodoFunc,
    } = useHttp();
    const {
      response: allTodos,
      isLoading: isTodoFetching,
      apiFunc: getTodos,
  } = useHttp();
  const {
    response: taskCompleteResponse,
    isLoading: isTaskCompleting,
    apiFunc: taskCompleteFunc,
} = useHttp();
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    useEffect(()=> {
      getTodos(apiGetTodos, {}, "GET")
    }, [getTodos, todoAdded, taskCompleteResponse])
    const handleTaskComplete = (id) => {
      taskCompleteFunc(apiCompleteTask, {params: {taskId: id}}, "DELETE");
    }
    const onAddingTodo = useCallback(() => {
        const momentDueDate = dueDate
            ? moment(dueDate).format("YYYY-MM-DD")
            : "";
        addTodoFunc(
            apiAddTodo,
            { data: { title, description, dueDate: momentDueDate } },
            "POST"
        );
    }, [title, description, dueDate, addTodoFunc]);
    const actionBodyTemplate = (row) => {
      const daysLeft = moment().diff(row.dueDate, 'days');
      return (
        <>
          <Button
          label="Complete"
            icon="pi pi-check"
            severity={`${daysLeft<0? "success": "danger"}`}
            size="small"
            onClick={()=> {handleTaskComplete(row._id)}}
          />
        </>
      );
    };
    return (
        <div className="m-3">
            {" "}
            <ToastContainer autoClose={2000} />
            <div className="">
                <Button
                    label="Show"
                    icon="pi pi-external-link"
                    onClick={() => setVisible(true)}
                />
                <Dialog
                    header="Header"
                    visible={visible}
                    style={{ width: "50vw" }}
                    onHide={() => setVisible(false)}
                >
                    <div className="flex flex-column">
                        <div className="grid">
                            <div className="col-6 flex justify-content-end">
                                <div className="flex align-items-center mr-3">
                                    Title :
                                </div>
                            </div>
                            <div className="col-6">
                                <InputText
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title"
                                    className="md:w-11rem p-inputtext-sm"
                                />
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-6 flex justify-content-end">
                                <div className="flex align-items-center mr-3">
                                    Description :{" "}
                                </div>
                            </div>
                            <div className="col-6">
                                <InputText
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Description"
                                    className="md:w-11rem p-inputtext-sm"
                                />
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-6 flex justify-content-end">
                                <div className="flex align-items-center mr-3">
                                    To Date :{" "}
                                </div>
                            </div>
                            <div className="col-6">
                                <Calendar
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.value)}
                                    className="md:w-6rem p-inputtext-sm"
                                    placeholder="To"
                                    // touchUI
                                />
                            </div>
                        </div>

                        <div className="flex justify-content-center mb-1">
                            <Button
                                label="ADD Todo"
                                severity="success"
                                type="button"
                                // disabled={isSubmitting}
                                raised
                                // loading={isSubmitting}
                                size="small"
                                onClick={onAddingTodo}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
            <DataTable value={allTodos ? allTodos: []} tableStyle={{ minWidth: "50rem" }}>
                <Column field="title" header="Title"></Column>
                <Column field="description" header="Description"></Column>
                <Column field="dueDate" header="DueDate"></Column>
                <Column  header="Action" body={actionBodyTemplate} align="center"></Column>
            </DataTable>
        </div>
    );
};
export default App;
