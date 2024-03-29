const fs = require('fs')
const YAML = require( 'js-yaml')
const core = require( '@actions/core')

const main = async () => {
    const templatePath = core.getInput('template_path', {required: true, trimWhitespace: true})
    const resourceGroup = core.getInput('resource_group_name', {required: true, trimWhitespace: true})
    const storageAccountName = core.getInput('storage_account_name', {required: true, trimWhitespace: true})
    const container_name = core.getInput('storage_container_name', {required: true, trimWhitespace: true})
    const subscriptionId = core.getInput('subscription_id', {required: true, trimWhitespace: true})

    const containerLogin = core.getInput('ghcr_login', {required: true, trimWhitespace: true})
    const containerToken = core.getInput('ghcr_token', {required: true, trimWhitespace: true})

    const appId = core.getInput('github_app_id', {required: true, trimWhitespace: true})
    const appWebhookSecret = core.getInput('github_app_webhook_secret', {required: true, trimWhitespace: true})
    const appPrivateKey = core.getInput('github_app_private_key', {required: true, trimWhitespace: true})
    const githubHost = core.getInput('github_host', {required: true, trimWhitespace: true})

    const spnObjectId = core.getInput('spn_object_id', {required: true, trimWhitespace: true})
    const spnClientId = core.getInput('spn_client_id', {required: true, trimWhitespace: true})
    const spnTenantId = core.getInput('spn_tenant_id', {required: true, trimWhitespace: true})
    const spnClientSecret = core.getInput('spn_client_secret', {required: true, trimWhitespace: true})

    const outfile = core.getInput('outfile', {required: true, trimWhitespace: true})

    const template = fs.readFileSync(templatePath, 'utf8').toString()
    const config = YAML.load(template)

    config.state.azure.resource_group_name = resourceGroup
    config.state.azure.storage_account_name = storageAccountName
    config.state.azure.container_name = container_name
    config.state.azure.subscription_id = subscriptionId

    config.service.container.login = containerLogin
    config.service.container.token = containerToken

    config.service.azure.subscription_id = subscriptionId
    config.service.azure.resource_group.name = resourceGroup

    config.service.github_app_details.app_id = appId
    config.service.github_app_details.ghe_host = githubHost
    config.service.github_app_details.private_key = appPrivateKey
    config.service.github_app_details.webhook_secret = appWebhookSecret

    config.service.scale_management_identity.azure_service_principal.object_id = spnObjectId
    config.service.scale_management_identity.azure_service_principal.client_id = spnClientId
    config.service.scale_management_identity.azure_service_principal.tenant_id = spnTenantId
    config.service.scale_management_identity.azure_service_principal.client_secret = spnClientSecret

    core.info(`Writing config to ${outfile}`)

    fs.writeFileSync(outfile, YAML.dump(config, {forceQuotes: true}))
}


main().catch(err => {
    console.log(err)
    core.setFailed(`Error: ${err}`)
})
