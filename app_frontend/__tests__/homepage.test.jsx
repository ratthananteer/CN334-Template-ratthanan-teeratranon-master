import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../pages/homepage/index';  // Adjust path if needed

// Mocking global fetch for API requests
global.fetch = jest.fn();

describe('HomePage Tests', () => {

  beforeEach(() => {
    // Mock the fetch response to return fake product data
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([
        { id: 1, product_name: 'Service A', status: true, price: 100, point: 4, image: '/path/to/image.jpg' },
        { id: 2, product_name: 'Service B', status: false, price: 200, point: 0, image: '/path/to/image.jpg' },
      ])
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the homepage and loads product data', async () => {
    render(<HomePage />);

    // Check if loading state or a part of the UI is shown before data is fetched
    expect(screen.getByText(/Exceeding Expectations, Winning Hearts/i)).toBeInTheDocument();

    // Wait for the fetch to resolve and the products to be displayed
    await waitFor(() => screen.getByText('Service A'));
    await waitFor(() => screen.getByText('Service B'));

    // Assert that product names are displayed
    expect(screen.getByText('Service A')).toBeInTheDocument();
    expect(screen.getByText('Service B')).toBeInTheDocument();
  });

  it('filters products based on search term', async () => {
    render(<HomePage />);

    // Wait for products to load
    await waitFor(() => screen.getByText('Service A'));
    await waitFor(() => screen.getByText('Service B'));

    // Enter a search term
    const searchInput = screen.getByPlaceholderText(/search for services/i);
    fireEvent.change(searchInput, { target: { value: 'A' } });

    // Check that only filtered products are displayed
    expect(screen.queryByText('Service A')).toBeInTheDocument();
    expect(screen.queryByText('Service B')).not.toBeInTheDocument();
  });

  it('submits a review', async () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});  // Mock alert
  
    render(<HomePage />);
  
    // Wait for products to load
    await waitFor(() => screen.getByText('Service A'));
  
    // Type in a review and submit
    const commentInput = screen.getByPlaceholderText(/Write your review/i);
    fireEvent.change(commentInput, { target: { value: 'Great service!' } });
    const submitButton = screen.getByText(/Submit Review/i);
    fireEvent.click(submitButton);
  
    // Check if the alert was called with the success message
    await waitFor(() => expect(mockAlert).toHaveBeenCalledWith('Review submitted successfully!'));
  
    // Clear mock
    mockAlert.mockRestore();
  });
  

  it('logs out when logout button is clicked', () => {
    const mockLocation = { href: '' };
    delete window.location;
    window.location = mockLocation; // Mock window.location to test redirect

    render(<HomePage />);

    const logoutButton = screen.getByText(/Log out/i);
    fireEvent.click(logoutButton);

    // Verify that localStorage is cleared and the user is redirected
    expect(localStorage.clear).toHaveBeenCalled();
    expect(mockLocation.href).toBe('/login');
  });

});
