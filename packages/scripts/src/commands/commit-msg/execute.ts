import { configureTasks } from './tasks'
import { success, fail } from '@essex/tasklogger'
import { execGulpTask } from '@essex/build-utils-gulp'

export async function execute(): Promise<number> {
  try {
    const task = configureTasks()
    await execGulpTask(task)
    success('commit-msg succeeded')
    return 0
  } catch (err) {
    fail('commit-msg failed', err)
    return 1
  }
}

