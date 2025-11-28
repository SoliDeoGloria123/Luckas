import axios from 'axios';
import { eventService } from '../eventService';

jest.mock('axios');

describe('eventService', () => {
    const mockEvents = [
        { _id: '1', nombre: 'Event 1', descripcion: 'Description 1' },
        { _id: '2', nombre: 'Event 2', descripcion: 'Description 2' }
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllEvents', () => {
        test('fetches all events successfully', async () => {
            axios.get.mockResolvedValue({ data: { success: true, data: mockEvents } });

            const result = await eventService.getAllEvents();

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/eventos'));
            expect(result).toEqual({ success: true, data: mockEvents });
        });

        test('handles error when fetching events', async () => {
            axios.get.mockRejectedValue(new Error('Network error'));

            await expect(eventService.getAllEvents()).rejects.toThrow('Network error');
        });
    });

    describe('createEvent', () => {
        test('creates event successfully', async () => {
            const newEvent = { nombre: 'New Event', descripcion: 'New Description' };
            axios.post.mockResolvedValue({ data: { success: true, data: newEvent } });

            const result = await eventService.createEvent(newEvent);

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/eventos'),
                newEvent
            );
            expect(result).toEqual({ success: true, data: newEvent });
        });
    });

    describe('updateEvent', () => {
        test('updates event successfully', async () => {
            const updatedEvent = { nombre: 'Updated Event' };
            axios.put.mockResolvedValue({ data: { success: true, data: updatedEvent } });

            const result = await eventService.updateEvent('1', updatedEvent);

            expect(axios.put).toHaveBeenCalledWith(
                expect.stringContaining('/eventos/1'),
                updatedEvent
            );
            expect(result).toEqual({ success: true, data: updatedEvent });
        });
    });

    describe('deleteEvent', () => {
        test('deletes event successfully', async () => {
            axios.delete.mockResolvedValue({ data: { success: true } });

            const result = await eventService.deleteEvent('1');

            expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/eventos/1'));
            expect(result).toEqual({ success: true });
        });
    });
});
