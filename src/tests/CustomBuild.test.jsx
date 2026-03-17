import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomBuild from '../pages/CustomBuild/CustomBuild.jsx';

const mockNavigate = vi.fn();
let mockLocationState = null; 

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: mockLocationState }),
    };
});

describe('CustomBuild Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockLocationState = null; 
        vi.stubGlobal('alert', vi.fn()); 
    });

    it('renders empty component slots by default', () => {
        render(
            <MemoryRouter>
                <CustomBuild />
            </MemoryRouter>
        );

        expect(screen.getByText('0 of 8 parts selected')).toBeDefined();
        expect(screen.getByPlaceholderText('Name your custom build...').value).toBe('');
    });

    it('pre-fills data when editBuild state is passed via router location', () => {
        mockLocationState = {
            editBuild: {
                id: '999',
                name: 'Upgraded Workstation',
                parts: { cpu: { brand: 'Intel', model: 'Core i9', price: 500 } }
            }
        };

        render(
            <MemoryRouter>
                <CustomBuild />
            </MemoryRouter>
        );

        expect(screen.getByDisplayValue('Upgraded Workstation')).toBeDefined();
        expect(screen.getByText('Intel Core i9')).toBeDefined();
        expect(screen.getByText('1 of 8 parts selected')).toBeDefined();
    });

    it('triggers an alert and prevents saving if the build name is missing', () => {
        mockLocationState = {
            editBuild: { id: '1', name: '', parts: { cpu: { brand: 'Intel', price: 100 } } }
        };

        render(
            <MemoryRouter>
                <CustomBuild />
            </MemoryRouter>
        );

        const saveBtn = screen.getByText('Save Build');
        fireEvent.click(saveBtn);

        expect(window.alert).toHaveBeenCalledWith("Please provide a name for your build.");
        expect(mockNavigate).not.toHaveBeenCalled(); 
    });

    it('triggers an alert and prevents saving if no parts are selected', () => {
        render(
            <MemoryRouter>
                <CustomBuild />
            </MemoryRouter>
        );

        const nameInput = screen.getByPlaceholderText('Name your custom build...');
        fireEvent.change(nameInput, { target: { value: 'Empty Build' } });

        const saveBtn = screen.getByText('Save Build');
        fireEvent.click(saveBtn);

        expect(window.alert).toHaveBeenCalledWith("Please add at least one part before saving.");
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});