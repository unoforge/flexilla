import { $$ } from '@flexilla/utilities';
import {
    OverlayScrollbars
} from 'overlayscrollbars';

export const initScroll = () => {
    const elements = $$('[data-hidden-scrollbar-s]')
    for (const element of elements) {
        OverlayScrollbars(element, {});
    }
}