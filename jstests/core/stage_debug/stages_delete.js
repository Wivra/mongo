// Test basic delete stage functionality.
//
// @tags: [
//   # The test runs commands that are not allowed with security token: stageDebug.
//   not_allowed_with_security_token,
//   # This test attempts to remove documents using the stageDebug command, which doesn't support
//   # specifying a writeConcern.
//   assumes_write_concern_unchanged,
//   does_not_support_stepdowns,
//   requires_fastcount,
//   uses_testing_only_commands,
//   no_selinux,
// ]

var coll = db.stages_delete;
var collScanStage = {cscan: {args: {direction: 1}, filter: {deleteMe: true}}};
var deleteStage;

// Test delete stage with isMulti: true.
coll.drop();
assert.commandWorked(coll.insert({deleteMe: true}));
assert.commandWorked(coll.insert({deleteMe: true}));
assert.commandWorked(coll.insert({deleteMe: false}));
deleteStage = {
    delete: {args: {node: collScanStage, isMulti: true}}
};
assert.eq(coll.count(), 3);
assert.commandWorked(db.runCommand({stageDebug: {collection: coll.getName(), plan: deleteStage}}));
assert.eq(coll.count(), 1);
assert.eq(coll.count({deleteMe: false}), 1);

// Test delete stage with isMulti: false.
coll.drop();
assert.commandWorked(coll.insert({deleteMe: true}));
assert.commandWorked(coll.insert({deleteMe: true}));
assert.commandWorked(coll.insert({deleteMe: false}));
deleteStage = {
    delete: {args: {node: collScanStage, isMulti: false}}
};
assert.eq(coll.count(), 3);
assert.commandWorked(db.runCommand({stageDebug: {collection: coll.getName(), plan: deleteStage}}));
assert.eq(coll.count(), 2);
assert.eq(coll.count({deleteMe: true}), 1);
assert.eq(coll.count({deleteMe: false}), 1);
