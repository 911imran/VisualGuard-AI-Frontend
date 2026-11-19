/**
 * Verification script for VisualGuard AI Service Layer
 */
import { mediaService } from '../src/services/mediaService.js';
import { processingService } from '../src/services/processingService.js';
import { detectionService } from '../src/services/detectionService.js';
import { exportService } from '../src/services/exportService.js';

console.log('--- Starting VisualGuard AI Service Layer Verification ---\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// 1. mediaService parameter assertions
try {
  await mediaService.uploadVideo(null);
  assert(false, 'mediaService.uploadVideo rejects null file');
} catch (err) {
  assert(err.message.includes('must be provided'), 'mediaService.uploadVideo validates file presence');
}

// 2. processingService schema assertions
try {
  await processingService.createTask({ mediaId: 0 });
  assert(false, 'processingService.createTask rejects mediaId <= 0');
} catch (err) {
  assert(err.message.includes('Valid media_id'), 'processingService.createTask validates media_id');
}

try {
  await processingService.createTask({ mediaId: 5, protectionType: 'invalid_type' });
  assert(false, 'processingService.createTask rejects invalid protectionType');
} catch (err) {
  assert(err.message.includes('Invalid protection_type'), 'processingService.createTask enforces backend enum [faces, number_plates, both]');
}

// 3. detectionService demo mode transparency
const demoEntities = detectionService.getDemoEvaluationEntities('video');
assert(demoEntities.length === 3, 'detectionService provides 3 standard evaluation entities');
assert(demoEntities.every(e => e.isDemo === true), 'All demo entities are strictly tagged with isDemo: true');
assert(demoEntities.some(e => e.entity_type === 'face') && demoEntities.some(e => e.entity_type === 'license_plate'), 'Demo entities include both Faces and Number Plates');

// 4. exportService filename formatting
assert(typeof exportService.downloadMedia === 'function', 'exportService.downloadMedia function exists');

console.log(`\n--- Verification Complete: ${passedTests}/${totalTests} Tests Passed ---`);
