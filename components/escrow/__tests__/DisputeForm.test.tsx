// src/escrow/__test__/DisputeForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import DisputeForm from '../DisputeForm';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock file for upload testing
const mockFile = new File(['test content'], 'evidence.pdf', { type: 'application/pdf' });

describe('DisputeForm Multi-Step Flow', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Navigation Tests', () => {
    test('navigates forward through all steps', async () => {
      render(<DisputeForm />);
      
      // Step 1: Fill personal info
      expect(screen.getByTestId('step-1')).toBeInTheDocument();
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/order number/i), 'ORD-123');
      
      // Click next to step 2
      const nextButton = screen.getByTestId('next-button');
      await userEvent.click(nextButton);
      expect(screen.getByTestId('step-2')).toBeInTheDocument();
      
      // Fill step 2 and go to step 3
      await userEvent.selectOptions(screen.getByLabelText(/reason/i), 'product_not_received');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a detailed description of the dispute with enough characters.');
      await userEvent.click(nextButton);
      expect(screen.getByTestId('step-3')).toBeInTheDocument();
      
      // Go to step 4
      await userEvent.click(nextButton);
      expect(screen.getByTestId('step-4')).toBeInTheDocument();
    });

    test('navigates backward through steps', async () => {
      render(<DisputeForm />);
      
      // Go to step 2
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Go back to step 1
      const backButton = screen.getByTestId('back-button');
      await userEvent.click(backButton);
      
      expect(screen.getByTestId('step-1')).toBeInTheDocument();
    });
  });

  describe('Step 2 Validation Tests', () => {
    test('blocks proceed when reason is empty (AC #2)', async () => {
      render(<DisputeForm />);
      
      // Navigate to step 2
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/order number/i), 'ORD-123');
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Try to proceed without selecting a reason
      const nextButton = screen.getByTestId('next-button');
      await userEvent.click(nextButton);
      
      // Should show error message
      expect(screen.getByText(/reason is required/i)).toBeInTheDocument();
      
      // Should still be on step 2
      expect(screen.getByTestId('step-2')).toBeInTheDocument();
    });

    test('allows proceed when reason is provided', async () => {
      render(<DisputeForm />);
      
      // Navigate to step 2
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Select reason and add description
      await userEvent.selectOptions(screen.getByLabelText(/reason/i), 'product_not_received');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a detailed description with enough characters for validation.');
      
      // Proceed to step 3
      await userEvent.click(screen.getByTestId('next-button'));
      
      expect(screen.getByTestId('step-3')).toBeInTheDocument();
    });
  });

  describe('File Upload Tests', () => {
    test('adds files to review step after upload (AC #3)', async () => {
      render(<DisputeForm />);
      
      // Navigate to step 3
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.selectOptions(screen.getByLabelText(/reason/i), 'product_not_received');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a detailed description with enough characters.');
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Upload file
      const fileInput = screen.getByTestId('file-input');
      await userEvent.upload(fileInput, mockFile);
      
      // Check file appears in list
      expect(screen.getByText('evidence.pdf')).toBeInTheDocument();
      
      // Go to review step
      await userEvent.click(screen.getByTestId('next-button'));
      
      // File should appear in review section
      expect(screen.getByTestId('review-section')).toBeInTheDocument();
      expect(screen.getByText('evidence.pdf')).toBeInTheDocument();
    });

    test('removes file when delete button is clicked', async () => {
      render(<DisputeForm />);
      
      // Navigate to step 3
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.selectOptions(screen.getByLabelText(/reason/i), 'product_not_received');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a detailed description with enough characters.');
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Upload file
      const fileInput = screen.getByTestId('file-input');
      await userEvent.upload(fileInput, mockFile);
      
      // Delete the file
      const deleteButton = screen.getByTestId('delete-file-0');
      await userEvent.click(deleteButton);
      
      // File should be removed
      expect(screen.queryByText('evidence.pdf')).not.toBeInTheDocument();
    });
  });

  describe('Submit Tests', () => {
    test('calls POST /dispute with correct payload (AC #4)', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, id: '123' })
      });
      
      render(<DisputeForm />);
      
      // Complete all steps
      // Step 1
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/order number/i), 'ORD-123');
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Step 2
      await userEvent.selectOptions(screen.getByLabelText(/reason/i), 'product_not_received');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a detailed description with enough characters for validation.');
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Step 3
      const fileInput = screen.getByTestId('file-input');
      await userEvent.upload(fileInput, mockFile);
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Step 4 - Agree to terms and submit
      await userEvent.click(screen.getByLabelText(/i confirm/i));
      await userEvent.click(screen.getByTestId('submit-button'));
      
      // Verify API call
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('/api/dispute', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }));
      });
      
      // Verify payload content
      const callArgs = fetch.mock.calls[0][1];
      const payload = JSON.parse(callArgs.body);
      expect(payload).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        orderNumber: 'ORD-123',
        reason: 'product_not_received'
      });
    });

    test('shows success state after successful submit (AC #5)', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, disputeId: 'DIS-123' })
      });
      
      render(<DisputeForm />);
      
      // Complete form submission
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.selectOptions(screen.getByLabelText(/reason/i), 'product_not_received');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a detailed description with enough characters.');
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.click(screen.getByLabelText(/i confirm/i));
      await userEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-state')).toBeInTheDocument();
        expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument();
      });
    });

    test('shows error state when API call fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<DisputeForm />);
      
      // Complete form submission
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.selectOptions(screen.getByLabelText(/reason/i), 'product_not_received');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a detailed description with enough characters.');
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.click(screen.getByLabelText(/i confirm/i));
      await userEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
        expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('persists form data when navigating back and forth', async () => {
      render(<DisputeForm />);
      
      // Fill step 1
      await userEvent.type(screen.getByLabelText(/name/i), 'Jane Smith');
      
      // Go to step 2
      await userEvent.click(screen.getByTestId('next-button'));
      
      // Go back to step 1
      await userEvent.click(screen.getByTestId('back-button'));
      
      // Data should still be there
      expect(screen.getByLabelText(/name/i)).toHaveValue('Jane Smith');
    });

    test('prevents submission while API call is in progress', async () => {
      // Mock slow response
      fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      render(<DisputeForm />);
      
      // Complete form
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.selectOptions(screen.getByLabelText(/reason/i), 'product_not_received');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a detailed description with enough characters.');
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.click(screen.getByTestId('next-button'));
      await userEvent.click(screen.getByLabelText(/i confirm/i));
      
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);
      
      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    });
  });
});