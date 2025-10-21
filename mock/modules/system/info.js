import { success } from '../../utils/result'

export default [
  {
    url: '/mock/system/info',
    method: 'get',
    response() {
      return success({
        jvm: {
          total: 663.23,
          used: 329.79,
          free: 333.44,
          version: '17',
        },
        memory: {
          total: 7.31,
          usage: 38.82,
          used: 2.84,
          free: 4.47,
        },
        cpu: {
          cores: 4,
          userUsage: 15,
          freeUsage: 85,
          sysUsage: 0,
        },
        dir: [
          {
            total: '39.2 GB',
            sysType: 'ext4',
            usage: '61.56%',
            dirPath: '/',
            used: '24.5 GB',
            free: '14.7 GB',
            dirType: '/',
          },
        ],
        info: {
          serviceIp: '172.23.12.66',
          os: 'Linux',
          arch: 'amd64',
          serviceName: 'iZwz90rjtrmd83mt2s0df8Z',
        },
      })
    },
  },
]
