import { startTransition, useOptimistic, useState, useTransition } from "react";

export default function TaskItem({ task, onToggle, onEdit}) {
    const [concluida, setOptimisticConcluida] = useOptimistic(task.concluida);
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startSaving] = useTransition();

    const handleToggle = async () => {
       startTransition(async () => {
            setOptimisticConcluida(!concluida);
            await onToggle({ ...task, concluida: !concluida });
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const titulo = formData.get('titulo').trim();
        const descricao = formData.get('descricao').trim() || null;

        const unchanged = titulo === task.titulo && descricao === (task.descricao || null);

        if (!titulo || unchanged) {
            setIsEditing(false);
            return;
        }

        startSaving(async () => {
            const ok = await onEdit(task, { titulo, descricao });
            if (ok) setIsEditing(false);
        });
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            setIsEditing(false);
        }
    }

    let className = "task";
    if (concluida) {
        className += " task--done";
    }

    if (isEditing) {
        className += " task--editing";
    }

    return (
        <li className={className} aria-busy={isPending}>
            <div className="task__check">
                <input
                    className="checkbox"
                    type="checkbox"
                    checked={task.concluida}
                    onChange={handleToggle}
                    aria-label={`Concluir: ${task.titulo}`}
                />
            </div>

          {isEditing ? (
                <form className="task__edit" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                    <div className="task__fields">
                        <label className="visually-hidden" htmlFor={`editar-titulo-${task.id}`}>
                            Título
                        </label>
                        <input
                            id={`editar-titulo-${task.id}`}
                            name="titulo"
                            className="task__input"
                            type="text"
                            defaultValue={task.titulo}
                            maxLength={255}
                            required
                            autoFocus
                            onFocus={(event) => event.target.select()}
                        />
                        <label className="visually-hidden" htmlFor={`editar-descricao-${task.id}`}>
                            Descrição
                        </label>
                        <textarea
                            id={`editar-descricao-${task.id}`}
                            name="descricao"
                            className="task__input task__input--details"
                            rows={2}
                            placeholder="Detalhes (opcional)"
                            defaultValue={task.descricao ?? ''}
                        />
                    </div>
                    <div className="task__actions">
                        <button className="task-action task-action--primary" type="submit">
                            Salvar
                        </button>
                        <button className="task-action" type="button" onClick={() => setIsEditing(false)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="task__body">
                        <span className="task__title">{task.titulo}</span>
                        {task.descricao && <p className="task__description">{task.descricao}</p>}
                    </div>
                    <div className="task__actions">
                        <button className="task-action" type="button" onClick={() => setIsEditing(true)}>
                            Editar
                        </button>
                        {/* botão Apagar: passo 7 */}
                    </div>
                </>
            )}
           
        </li>
    )
}