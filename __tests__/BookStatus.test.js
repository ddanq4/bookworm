import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '@/components/BookCard';
import React from 'react';


const mockBook = {
    id: '42',
    title: 'Test Book',
    authors: [{ name: 'Author X' }],
    imageLinks: {
        thumbnail: 'https://example.com/image.jpg'
    }
};

describe('BookCard status change', () => {
    it('показывает меню и вызывает добавление со статусом "reading"', () => {
        const onStatusUpdate = jest.fn();

        render(
            <BookCard
                book={mockBook}
                status={null}
                onStatusUpdate={onStatusUpdate}
            />
        );

        fireEvent.click(screen.getByText(/Додати/i));
        fireEvent.click(screen.getByText(/Читаю/i));

        expect(onStatusUpdate).toHaveBeenCalledWith('reading');
    });

    it('можно выбрать "Хочу прочитати" и "Прочитано"', () => {
        const onStatusUpdate = jest.fn();

        render(
            <BookCard
                book={mockBook}
                status={null}
                onStatusUpdate={onStatusUpdate}
            />
        );

        fireEvent.click(screen.getByText(/Додати/i));

        fireEvent.click(screen.getByText(/Хочу прочитати/i));
        expect(onStatusUpdate).toHaveBeenCalledWith('want_to_read');

        fireEvent.click(screen.getByText(/Додати/i));
        fireEvent.click(screen.getByText(/Прочитано/i));
        expect(onStatusUpdate).toHaveBeenCalledWith('finished');
    });
});
