import { API_BASE } from './config.js';
import { readError, requirePositiveInteger } from './groups.js';

export async function getExpenses(id) {
    const groupId = requirePositiveInteger(id, 'Group ID');
    const response = await fetch(`${API_BASE}/groups/${groupId}/expenses`, {
        credentials: 'include'
    });
    if (!response.ok) {
        return { error: await readError(response, 'Could not load expenses.') };
    }
    return { expenses: await response.json() };
}

export async function createExpense(id, expense) {
    const groupId = requirePositiveInteger(id, 'Group ID');
    const response = await fetch(`${API_BASE}/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(expense)
    });

    // AC2, AC3, AC6: the backend returns one message per invalid field.
    if (response.status === 400) {
        return { errors: await response.json() };
    }
    if (!response.ok) {
        return { errors: { form: await readError(response, 'Could not add this expense.') } };
    }
    return { expense: await response.json() };
}
