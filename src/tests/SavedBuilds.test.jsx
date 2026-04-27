import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SavedBuilds from '../pages/SavedBuilds/SavedBuilds.jsx';
import { AuthContext } from '../context/AuthContext.js';

const mockNavigate = vi.fn();

vi.mock("../lib/buildsApi", () => ({
    getUserBuilds: vi.fn(),
    deleteBuild: vi.fn()
}));
import { getUserBuilds } from '../lib/buildsApi.js';
import userEvent from '@testing-library/user-event';

const mockSession = {
    user: { id: "11948775-23ab-416f-ad09-76f62ecec1f2" }
};

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
        vi.stubGlobal('confirm', vi.fn(() => true)); 
    });

    it('renders the empty state when no builds are saved', async () => {
        getUserBuilds.mockResolvedValue([]);

        render(
            <AuthContext.Provider value={{ session: mockSession }}>
                <MemoryRouter>
                    <SavedBuilds />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect(await screen.findByText(/You haven't saved any builds yet/i)).toBeDefined();
        expect(await screen.findByRole('button', { name: /Create a Build/i })).toBeDefined();
    });

    it('renders saved builds with valid session', async () => {
        const mockBuilds = [{
            id: '123',
            name: 'My Gaming Rig',
            totalPrice: 1500,
            dateSaved: '10/24/2025',
            parts: { 
                cpu: { 
                    part: { brand: 'AMD', model: 'Ryzen 5', price: 200 },
                    compatible: true,
                    issues: []
                } 
            }
        }];

        getUserBuilds.mockResolvedValue(mockBuilds);

        render(
            <AuthContext.Provider value={{ session: mockSession }}>
                <MemoryRouter>
                    <SavedBuilds />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect(await screen.findByText('My Gaming Rig')).toBeDefined();
        expect(await screen.findByText('$1500.00')).toBeDefined();
        expect(await screen.findByText('AMD Ryzen 5')).toBeDefined();
    });

    it('deletes a build when the delete button is clicked and confirmed', async () => {
        const mockBuilds = [{
            id: '123',
            name: 'Build To Delete',
            totalPrice: 1000,
            dateSaved: '10/24/2025',
            parts: {}
        }];

        getUserBuilds.mockResolvedValue(mockBuilds);

        render(
            <AuthContext.Provider value={{ session: mockSession }}>
                <MemoryRouter>
                    <SavedBuilds />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        const user = userEvent.setup();
        const deleteBtn = await screen.findByText('Delete');
        await user.click(deleteBtn);

        vi.spyOn(window, "confirm").mockReturnValue(true);
        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this build?");
        await waitFor(() => {
            expect(screen.queryByText('Build To Delete')).not.toBeInTheDocument();
        });
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

        render(
            <AuthContext.Provider value={{ session: mockSession }}>
                <MemoryRouter>
                    <SavedBuilds />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        
        const user = userEvent.setup();
        const editBtn = await screen.findByText('Edit');
        await user.click(editBtn);

        expect(mockNavigate).toHaveBeenCalledWith("/custom-build", { state: { editBuild: mockBuild } });
    });
});