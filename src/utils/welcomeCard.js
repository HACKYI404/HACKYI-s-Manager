import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BG_PATH = path.join(__dirname, '../assets/welcome_bg.png');

// Circle position measured from the background image
const AVATAR_CENTER_X = 516;
const AVATAR_CENTER_Y = 235;
const AVATAR_RADIUS   = 65;   // fits inside the white ring (outer ring radius ~76)

/**
 * Generates a welcome card buffer.
 * @param {string} avatarUrl  - User's avatar URL
 * @param {string} username   - Display name shown on the card
 * @param {number} memberCount - Guild member count
 * @returns {Promise<Buffer>} PNG buffer
 */
export async function generateWelcomeCard(avatarUrl, username, memberCount) {
    try {
        const bg     = await loadImage(BG_PATH);
        const avatar = await loadImage(avatarUrl);

        const canvas = createCanvas(bg.width, bg.height);
        const ctx    = canvas.getContext('2d');

        // ── Background ──────────────────────────────────────────────
        ctx.drawImage(bg, 0, 0);

        // ── Circular avatar clip ────────────────────────────────────
        ctx.save();
        ctx.beginPath();
        ctx.arc(AVATAR_CENTER_X, AVATAR_CENTER_Y, AVATAR_RADIUS, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
            avatar,
            AVATAR_CENTER_X - AVATAR_RADIUS,
            AVATAR_CENTER_Y - AVATAR_RADIUS,
            AVATAR_RADIUS * 2,
            AVATAR_RADIUS * 2,
        );
        ctx.restore();

        // ── Semi-transparent bottom bar for text legibility ─────────
        const textAreaY = AVATAR_CENTER_Y + AVATAR_RADIUS + 18;
        const barHeight = bg.height - textAreaY - 8;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.roundRect(40, textAreaY, bg.width - 80, barHeight, 8);
        ctx.fill();

        // ── "username just joined the server" ───────────────────────
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.font         = 'bold 30px sans-serif';
        ctx.fillStyle    = '#ffffff';
        ctx.shadowColor  = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur   = 8;
        ctx.fillText(
            `${username} just joined the server`,
            bg.width / 2,
            textAreaY + barHeight * 0.38,
        );

        // ── "Member #N" ─────────────────────────────────────────────
        ctx.font      = '22px sans-serif';
        ctx.fillStyle = '#cccccc';
        ctx.fillText(
            `Member #${memberCount}`,
            bg.width / 2,
            textAreaY + barHeight * 0.72,
        );

        ctx.shadowBlur = 0;

        return canvas.toBuffer('image/png');
    } catch (err) {
        logger.error('welcomeCard: failed to generate card:', err);
        return null;
    }
}
