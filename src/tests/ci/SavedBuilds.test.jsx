import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SavedBuilds from '../../pages/SavedBuilds/SavedBuilds.jsx';
import { AuthContext } from '../../context/AuthContext.js';

const mockNavigate = vi.fn();

vi.mock("../../lib/buildsApi", () => ({
    getUserBuilds: vi.fn(),
    deleteBuild: vi.fn()
}));

import { getUserBuilds, deleteBuild } from '../lib/buildsApi';

const mockSession = {
    user: { id: "11948775-23ab-416f-ad09-76f62ecec1f2" }
};

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../lib/buildsApi', () => ({
    getUserBuilds: vi.fn(),
    deleteBuild: vi.fn(),
}));

function renderWithAuth(session = null) {
    return render(
        <AuthContext.Provider value={{ session, loading: false }}>
            <MemoryRouter>
                <SavedBuilds />
            </MemoryRouter>
        </AuthContext.Provider>
    );
}

describe('SavedBuilds Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('confirm', vi.fn(() => true));
    });

    it('renders the empty state when no session exists', () => {
        renderWithAuth(null);
        expect(screen.getByText(/You haven't saved any builds yet/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Create a Build/i })).toBeDefined();
    });

    it('renders saved builds from the API', async () => {
        getUserBuilds.mockResolvedValue([{
            id: '123',
            name: 'My Gaming Rig',
            totalPrice: 1500,
            dateSaved: '10/24/2025',
            parts: {
                cpu: {
                    part: { brand: 'AMD', model: 'Ryzen 5', price: 200 },
                    issues: []
                }
            }
        }]);

        renderWithAuth(mockSession);

        await waitFor(() => expect(screen.getByText('My Gaming Rig')).toBeDefined());
        expect(screen.getByText('$1500.00')).toBeDefined();
        expect(screen.getByText('AMD Ryzen 5')).toBeDefined();
    });

    it('deletes a build when the delete button is clicked and confirmed', async () => {
        getUserBuilds.mockResolvedValue([{
            id: '123',
            name: 'Build To Delete',
            totalPrice: 1000,
            dateSaved: '10/24/2025',
            parts: {}
        }]);
        deleteBuild.mockResolvedValue({});

        renderWithAuth(mockSession);

        await waitFor(() => expect(screen.getByText('Build To Delete')).toBeDefined());
        fireEvent.click(screen.getByText('Delete'));

        vi.spyOn(window, "confirm").mockReturnValue(true);
        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this build?");
        await waitFor(() => expect(screen.queryByText('Build To Delete')).toBeNull());
    });

    it('navigates to custom-build with correct state when edit is clicked', async () => {
        const mockBuild = {
            id: '123',
            name: 'Build To Edit',
            totalPrice: 1000,
            dateSaved: '10/24/2025',
            parts: {}
        };
        getUserBuilds.mockResolvedValue([mockBuild]);

        renderWithAuth(mockSession);

        await waitFor(() => expect(screen.getByText('Build To Edit')).toBeDefined());
        fireEvent.click(screen.getByText('Edit'));

        expect(mockNavigate).toHaveBeenCalledWith("/custom-build", { state: { editBuild: mockBuild } });
    });
});
