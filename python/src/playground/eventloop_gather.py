import asyncio
from abc import ABC, abstractmethod


class Ready(ABC):
    @abstractmethod
    async def ready(self):
        pass

# java way of currying
class FastTask(Ready):
    async def ready(self):
        print("Fast ready start")
        return True

class SlowTask(Ready):
    def __init__(self, timeout):
        self.timout = timeout

    async def ready(self):
        print("Slow-{} ready start ".format(self.timout))
        await asyncio.sleep(self.timout)
        return True



async def gather_routine():
    print("Before Gathering")
    li = [FastTask(), FastTask(), SlowTask(2), SlowTask(5)]

    result = await asyncio.gather(*map(lambda ready: ready.ready(), li))
    print(result)
    print("All Finished")

if __name__ == '__main__':
    asyncio.get_event_loop().create_task(gather_routine())
    asyncio.get_event_loop().run_forever()



