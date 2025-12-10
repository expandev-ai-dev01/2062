/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as initExampleController from '@/api/internal/init-example/controller';
import * as fileUploadController from '@/api/internal/file-upload/controller';
import * as pngConversionController from '@/api/internal/png-conversion/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Init-Example routes - /api/internal/init-example
 */
router.get('/init-example', initExampleController.listHandler);
router.post('/init-example', initExampleController.createHandler);
router.get('/init-example/:id', initExampleController.getHandler);
router.put('/init-example/:id', initExampleController.updateHandler);
router.delete('/init-example/:id', initExampleController.deleteHandler);

/**
 * @rule {be-route-configuration}
 * File Upload routes - /api/internal/file-upload
 */
router.post('/file-upload', fileUploadController.uploadHandler);
router.get('/file-upload/:id', fileUploadController.getHandler);
router.delete('/file-upload/:id', fileUploadController.cancelHandler);

/**
 * @rule {be-route-configuration}
 * PNG Conversion routes - /api/internal/png-conversion
 */
router.post('/png-conversion', pngConversionController.convertHandler);

export default router;
