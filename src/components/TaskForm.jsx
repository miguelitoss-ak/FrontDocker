// src/components/TaskForm.jsx
import { useActionState } from "react";
const empty = { titulo: "", descricao: "" };

export default function TaskForm({ onAdd }) {
    const [state, formAction, isPending] = useActionState(async (_previousState, formData) => {
        const titulo = formData.get("titulo").trim();
        const descricao = formData.get("descricao").trim();

        if (!titulo) return empty;

        const ok = await onAdd({ titulo, descricao: descricao || null });

        // Se a ação falhar, retornamos os dados do formulário para que o usuário possa corrigir.
        return ok ? empty : { titulo, descricao };
    }, empty)

    return (
        <form className="task-form" action={formAction}>
            <span className="task-form__mark" aria-hidden="true">➕</span>

            <label className="visually-hidden" htmlFor="titulo">Título da Tarefa</label>
            <input
                id="titulo"
                name="titulo"
                className="task-form__input"
                type="text"
                placeholder="O que precisa ser feito?"
                autoComplete="off"
                maxLength={255}
                required
                defaultValue={state.titulo}
                disabled={isPending}
            />

            <label className="visually-hidden" htmlFor="nova-descricao">Descrição da Tarefa</label>
            <textarea
                className="task-form__details"
                id="nova-descricao"
                name="descricao"
                placeholder="Detalhes da tarefa..."
                defaultValue={state.descricao}
                disabled={isPending}
            />

            <button type="submit" className="button button--primary" disabled={isPending}>
                {isPending ? "Adicionando..." : "Adicionar Tarefa"}
            </button>
        </form>
    )
}