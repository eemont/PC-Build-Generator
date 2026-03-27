import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFindParts = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock('../domain/partsApi', () => ({
    findParts: mockFindParts,
}));

import GenerateBuild from '../pages/GenerateBuild/GenerateBuild.jsx';

describe('GenerateBuild - Build Generation Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('disables the button and shows Generating... while the API is loading', async () => {
        mockFindParts.mockImplementation(() => new Promise(() => {}));

        render(
            <MemoryRouter>
                <GenerateBuild />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/enter your budget/i), {
            target: { value: '1000' },
        });
        fireEvent.click(screen.getByRole('button', { name: /^generate$/i }));

        const btn = await screen.findByRole('button', { name: /generating/i });
        expect(btn).toBeDisabled();
    });

    it('shows an error message and does not navigate if the API fails', async () => {
        mockFindParts.mockRejectedValue(new Error('Network error'));

        render(
            <MemoryRouter>
                <GenerateBuild />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/enter your budget/i), {
            target: { value: '1000' },
        });
        fireEvent.click(screen.getByRole('button', { name: /^generate$/i }));

        expect(await screen.findByText(/failed to generate build/i)).toBeInTheDocument();
    });
});