# Walkin Plug-in

## API Reference

#### Get events

```http
  GET api/1.1/obj/eventview?constraints=[ { "key": "is_display_conference", "constraint_type": "equals", "value": "yes" }, { "key": "partner_id", "constraint_type": "equals", "value": "{partner_id}" }]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `partner_id` | `string` | **Required**. Your unique ID |

#### Submit event

```http
  POST api/1.1/wf/submit-external-event
```
```
'Content-Type': 'application/json'
{
        email: string, 
        name: string, 
        jobTitle: string,
        companyName: string,
        logo: file, 
        companyWebsite: string,
        LinkedIn: string,
        twitter: string,
        telegram: string,
        eventTitle: string,
        banner: file, 
        description: string,
        location: string,
        startDate: date,
        endDate: date,
        capacity: number,
        type: string,
        externalLink: string,
        wallet: string,
        partner: string
    }
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. User's email |
| `name`      | `string` | **Required**. User's name |
| `jobTitle`      | `string` | **Required**. User's job Title |
| `companyName`      | `string` | **Required**. Company name |
| `logo`      | `string` | **Required**. Company Logo |
| `companyWebsite`      | `string` | **Required**. Company website |
| `LinkedIn`      | `string` | **Required**. User's LinkedIn |
| `twitter`      | `string` | User's Twitter |
| `telegram`      | `string` | User's telegram ID |
| `eventTitle`      | `string` | **Required**. Event Title |
| `banner`      | `string` | **Required**. Event banner |
| `description`      | `string` | **Required**. Event description |
| `location`      | `string` | **Required**. Location of the event |
| `startDate`      | `string` | **Required**. Event Start date |
| `endDate`      | `string` | **Required**. Event End date |
| `capacity`      | `string` | **Required**. Event capacity |
| `type`      | `string` | **Required**. Event type |
| `externalLink`      | `string` | Event link |
| `wallet`      | `string` | User's wallet |
| `partner`      | `string` | **Required**. Partner Id |
