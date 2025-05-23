import { render, screen } from '@testing-library/react';
import BookModal from '@/components/BookModal';

const book = {
    id: '1',
    volumeInfo: {
        title: 'Modal Book',
        authors: ['Author X'],
        publishedDate: '2022',
        imageLinks: {
            thumbnail: 'https://example.com/cover.jpg'
        },
        description: 'Description text'
    }
};

describe('BookModal', () => {
    it('отображает данные книги в модалке', () => {
        render(<BookModal book={book} status="want" setStatus={() => {}} onClose={() => {}} onStatusUpdate={() => {}} />);
        expect(screen.getByText(/Modal Book/i)).toBeInTheDocument();
        expect(screen.getByText(/Author X/i)).toBeInTheDocument();
        expect(screen.getByText(/Description text/i)).toBeInTheDocument();
    });
});
