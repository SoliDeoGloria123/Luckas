import { render, screen } from '@testing-library/react';
import FormField from '../FormField';

describe('FormField', () => {
    const mockOnChange = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders input with name attribute when provided', () => {
        render(
            <FormField
                id="test-field"
                name="testName"
                label="Test Label"
                value=""
                onChange={mockOnChange}
            />
        );
        const input = screen.getByLabelText(/Test Label/i);
        expect(input).toHaveAttribute('name', 'testName');
        expect(input).toHaveAttribute('id', 'test-field');
    });

    test('uses id as fallback for name when name not provided', () => {
        render(
            <FormField
                id="test-id"
                label="Test Label"
                value=""
                onChange={mockOnChange}
            />
        );
        const input = screen.getByLabelText(/Test Label/i);
        expect(input).toHaveAttribute('name', 'test-id');
    });

    test('renders select element when type is select', () => {
        render(
            <FormField
                id="select-field"
                name="selectName"
                label="Select Label"
                type="select"
                value=""
                onChange={mockOnChange}
            >
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </FormField>
        );
        const select = screen.getByLabelText(/Select Label/i);
        expect(select.tagName).toBe('SELECT');
        expect(select).toHaveAttribute('name', 'selectName');
    });

    test('renders input with correct type', () => {
        render(
            <FormField
                id="email-field"
                name="email"
                label="Email"
                type="email"
                value=""
                onChange={mockOnChange}
            />
        );
        const input = screen.getByLabelText(/Email/i);
        expect(input).toHaveAttribute('type', 'email');
    });

    test('renders input with placeholder', () => {
        render(
            <FormField
                id="test-field"
                label="Test Label"
                value=""
                onChange={mockOnChange}
                placeholder="Enter text"
            />
        );
        const input = screen.getByPlaceholderText(/Enter text/i);
        expect(input).toBeInTheDocument();
    });

    test('renders required input when required prop is true', () => {
        render(
            <FormField
                id="required-field"
                label="Required Field"
                value=""
                onChange={mockOnChange}
                required={true}
            />
        );
        const input = screen.getByLabelText(/Required Field/i);
        expect(input).toBeRequired();
    });

    test('passes inputProps to input element', () => {
        render(
            <FormField
                id="test-field"
                label="Test Label"
                value=""
                onChange={mockOnChange}
                inputProps={{ 'data-testid': 'custom-input', min: '0' }}
            />
        );
        const input = screen.getByTestId('custom-input');
        expect(input).toHaveAttribute('min', '0');
    });

    test('renders with correct value', () => {
        render(
            <FormField
                id="test-field"
                label="Test Label"
                value="test value"
                onChange={mockOnChange}
            />
        );
        const input = screen.getByLabelText(/Test Label/i);
        expect(input).toHaveValue('test value');
    });
});
