library 'EsitesDeploy'

node {
    checkout scm

    env.TARGET_MODE = "stg"
    env.DATE_TIME_STAMP = sh(script: "printf `date +'%Y%m%d%H%M'`", returnStdout: true)
    env.SERVER_PATH = buildProperty("setting.${TARGET_MODE}.path")
    env.SERVER_HOST = buildProperty("setting.${TARGET_MODE}.host")
    env.BUILD_NAME = "revision-${DATE_TIME_STAMP}"
    env.BUILD_PATH = "${SERVER_PATH}/builds/${BUILD_NAME}"
    env.LIVE_PATH = "${SERVER_PATH}/site"

    stage('build') {
        sh "npm install --production"
    }

    stage ('deploy') {

        print "Deploying to target: $TARGET_MODE"

        uploadBuild hosts: [ "$SERVER_HOST" ],
                localBuildPath: pwd(),
                remoteBuildPath: "${BUILD_PATH}",
                remoteLivePath: "${LIVE_PATH}"


        executeOnRemoteHosts hosts: [ "$SERVER_HOST" ],
                script: '''
                mkdir -p ${BUILD_PATH}/tmp;
                touch ${BUILD_PATH}/tmp/restart.txt;
                '''

        goLive hosts: [ "$SERVER_HOST" ],
                remoteServerPath: "${SERVER_PATH}",
                remoteBuildPath: "builds/${BUILD_NAME}",
                remoteLivePath: "$LIVE_PATH"

        cleanOldBuilds hosts: [ "$SERVER_HOST" ],
                remoteServerPath: "${SERVER_PATH}",
                currentBuildName: "${BUILD_NAME}"
    }
}