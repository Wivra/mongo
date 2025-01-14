# burn_in_tags

## What it is

Similar to [burn_in_tests](burn_in_tests.md), `burn_in_tags` also detects the javascript tests
(under the [jstests directory](https://github.com/mongodb/mongo/tree/master/jstests))
that are new or have changed since the last git command and then runs those tests in repeated
mode to validate their stability. But instead of running the tests on their original build
variants, `burn_in_tags` runs them on the burn_in build variants that are generated separately.

## How to use it

You can use `burn_in_tags` on evergreen by selecting the `burn_in_tags_gen` task when creating a patch.
The burn_in build variants, i.e., `enterprise-rhel-80-64-bit-inmem` and `enterprise-rhel-80-64-bit-multiversion`
will be generated, each of which will have a `burn_in_tests` task generated by the
[mongo-task-generator](https://github.com/mongodb/mongo-task-generator). `burn_in_tests` task, a
[generated task](task_generation.md), may have multiple sub-tasks which run the test suites only for the
new or changed javascript tests (note that a javascript test can be included in multiple test suites). Each of
those tests will be run 2 times minimum, and 1000 times maximum or for 10 minutes, whichever is reached first.

## ! Run All Affected JStests
The `! Run All Affected JStests` variant has a single `burn_in_tags_gen` task. This task will create &
activate [`burn_in_tests`](burn_in_tests.md) tasks for all required and suggested
variants. The end result is that any jstests that have been modified in the patch will
run on all required and suggested variants. This should give users a clear signal on
whether their jstests changes have introduced a failure that could potentially lead
to a revert or follow-up bug fix commit.
