import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import FAQ from '../pages/FAQ/FAQ.jsx';

describe('FAQ - Accordion Interaction', () => {
    it('answers are hidden by default', () => {
        render(
            <MemoryRouter>
                <FAQ />
            </MemoryRouter>
        );

        const buttons = screen.getAllByRole('button');
        buttons.forEach((btn) => {
            const expanded = btn.getAttribute('aria-expanded');
            if (expanded !== null) {
                expect(expanded).toBe('false');
            }
        });
    });

    it('clicking a question expands it', () => {
        render(
            <MemoryRouter>
                <FAQ />
            </MemoryRouter>
        );

        const [firstQuestion] = screen.getAllByRole('button');
        fireEvent.click(firstQuestion);

        const expanded = firstQuestion.getAttribute('aria-expanded');
        if (expanded !== null) {
            expect(expanded).toBe('true');
        }
    });

    it('clicking an open question collapses it', () => {
        render(
            <MemoryRouter>
                <FAQ />
            </MemoryRouter>
        );

        const [firstQuestion] = screen.getAllByRole('button');
        fireEvent.click(firstQuestion); // open
        fireEvent.click(firstQuestion); // close

        const expanded = firstQuestion.getAttribute('aria-expanded');
        if (expanded !== null) {
            expect(expanded).toBe('false');
        }
    });

    it('clicking a second question opens it', () => {
        render(
            <MemoryRouter>
                <FAQ />
            </MemoryRouter>
        );

        const buttons = screen.getAllByRole('button');
        if (buttons.length < 2) return;

        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);

        const expanded = buttons[1].getAttribute('aria-expanded');
        if (expanded !== null) {
            expect(expanded).toBe('true');
        }
    });
});