import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SavedBuilds from '../pages/SavedBuilds/SavedBuilds.jsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('SavedBuilds Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.stubGlobal('confirm', vi.fn(() => true)); 
    });

    it('renders the empty state when no builds are saved', () => {
        render(
            <MemoryRouter>
                <SavedBuilds />
            </MemoryRouter>
        );

        expect(screen.getByText(/You haven't saved any builds yet/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Create a Build/i })).toBeDefined();
    });

    it('renders saved builds from localStorage', () => {
        const mockBuilds = [{
            id: '123',
            name: 'My Gaming Rig',
            totalPrice: 1500,
            dateSaved: '10/24/2025',
            parts: { cpu: { brand: 'AMD', model: 'Ryzen 5', price: 200 } }
        }];
        localStorage.setItem('savedBuilds', JSON.stringify(mockBuilds));

        render(
            <MemoryRouter>
                <SavedBuilds />
            </MemoryRouter>
        );

        expect(screen.getByText('My Gaming Rig')).toBeDefined();
        expect(screen.getByText('$1500.00')).toBeDefined();
        expect(screen.getByText('AMD Ryzen 5')).toBeDefined();
    });

    it('deletes a build when the delete button is clicked and confirmed', () => {
        const mockBuilds = [{
            id: '123',
            name: 'Build To Delete',
            totalPrice: 1000,
            dateSaved: '10/24/2025',
            parts: {}
        }];
        localStorage.setItem('savedBuilds', JSON.stringify(mockBuilds));

        render(
            <MemoryRouter>
                <SavedBuilds />
            </MemoryRouter>
        );

        const deleteBtn = screen.getByText('Delete');
        fireEvent.click(deleteBtn);

        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this build?");
        expect(JSON.parse(localStorage.getItem('savedBuilds'))).toHaveLength(0);
        expect(screen.queryByText('Build To Delete')).toBeNull();
    });

    it('navigates to custom-build with correct state when edit is clicked', () => {
        const mockBuild = {
            id: '123',
            name: 'Build To Edit',
            totalPrice: 1000,
            dateSaved: '10/24/2025',
            parts: {}
        };
        localStorage.setItem('savedBuilds', JSON.stringify([mockBuild]));

        render(
            <MemoryRouter>
                <SavedBuilds />
            </MemoryRouter>
        );

        const editBtn = screen.getByText('Edit');
        fireEvent.click(editBtn);

        expect(mockNavigate).toHaveBeenCalledWith("/custom-build", { state: { editBuild: mockBuild } });
    });
});