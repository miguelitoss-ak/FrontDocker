import { startTransition, useOptimistic } from "react";

export default function TaskItem({ task, onToggle }) {
    const [concluida, setOptimisticConcluida] = useOptimistic(task.concluida);

    const handleToggle = async () => {
       startTransition(async () => {
            setOptimisticConcluida(!concluida);
            await onToggle({ ...task, concluida: !concluida });
        });
    }

    let className = "task";
    if (task.concluida) {
        className += " task--done";
    }

    return (
        <li className={className}>
            <div className="task__check">
                <input
                    className="checkbox"
                    type="checkbox"
                    checked={task.concluida}
                    onChange={handleToggle}
                    aria-label={`Concluir: ${task.titulo}`}
                />
            </div>

            <div className="task__body">
                <span className="task__title">{task.titulo}</span>
                
                {task.descricao && <p className="task__description">{task.descricao}</p>}
            </div>

            <div className="task__actions">
                <button className="task-action">
                    Editar
                </button>
                <button className="task-action task-action--danger">
                    Remover
                </button>
            </div>
        </li>
    )
}