import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { useCreateBotCommand, useUpdateBotCommand, useBotCommand, useBotCommands } from '../../features/bot commands/hooks/useBotCommands';
import TextareaAutosize from 'react-textarea-autosize';
import './BotCommandsDashboard.css'

const BotCommandsEntry = () => {

    const { id } = useParams();
    
    const navigate = useNavigate();

    const isEditMode = id && id !== '0';

    const createMutation = useCreateBotCommand();
    const updateMutation = useUpdateBotCommand();

    const [validationError, setValidationError] = useState('');

    // Fetch Data (Only runs if isEditMode is true)
    const { 
        data: fetchedBotCommand, 
        isLoading: isLoadingData, 
        isError: isFetchError 
    } = useBotCommand(id);

    const { data: botCommands, isLoading: isLoadingList } = useBotCommands();

    const isPending = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    const [formData, setFormData] = useState({
        id: 0,
        keyword: "",
        description: "",
        trigger: "",
        text: "",
        lang: "en",
        nextKeywords: [], 
        translations: []
    });

    // POPULATE FORM when data arrives
    useEffect(() => {
        // console.log("Fetched bot command: ", fetchedBotCommand);
        
        if (fetchedBotCommand) {

            const mainText = fetchedBotCommand.texts['en'] || "";
            const mainTrigger = fetchedBotCommand.triggers['en'] || "";

            const textsLangauges = Object.keys(fetchedBotCommand.texts || {});
            const triggersLangauges = Object.keys(fetchedBotCommand.triggers || {});
            const availableLangs = textsLangauges.length > triggersLangauges.length ? textsLangauges : triggersLangauges;
            
            const translationArray = availableLangs
                .filter(lang => lang !== 'en') // Exclude English
                .map(lang => ({
                    lang: lang,
                    text: fetchedBotCommand.texts[lang] || "",
                    trigger: fetchedBotCommand.triggers[lang] || ""
                }));

            setFormData({
                id: fetchedBotCommand.id,
                keyword: fetchedBotCommand.keyword || '',
                description: fetchedBotCommand.description || '',
                trigger: mainTrigger,
                text: mainText,
                nextKeywords: fetchedBotCommand.nextKeywords || [], 
                translations: translationArray,
            });
        }
    }, [fetchedBotCommand]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setValidationError('')
    };

    const handleNextKeywordChange = (keywordValue) => {
        const currentKeywords = [...formData.nextKeywords];
        
        if (currentKeywords.includes(keywordValue)) {
            // Remove if exists
            setFormData({
                ...formData,
                nextKeywords: currentKeywords.filter(k => k !== keywordValue)
            });
        } else {
            // Add if doesn't exist
            setFormData({
                ...formData,
                nextKeywords: [...currentKeywords, keywordValue]
            });
        }
        setValidationError('')
    };

    // Function to handle changes in a specific translation
    const handleTranslationChange = (index, field, value) => {
      const updatedTranslations = [...formData.translations];
      updatedTranslations[index] = {
        ...updatedTranslations[index],
        [field]: value
      };

      setFormData({
        ...formData,
        translations: updatedTranslations
      });
      setValidationError('')
    };
  
    const handleAddTranslation = () => {
      setFormData({
            ...formData,
            translations: [
                ...formData.translations, 
                { lang: 'ar', trigger: '', text: '' }
            ]
      });
      setValidationError('')
    };

    const handleChildDelete = (indexToDelete) => {
        const updatedTranslations = formData.translations.filter((_, index) => index !== indexToDelete);
        
        setFormData({
            ...formData,
            translations: updatedTranslations
        });
        setValidationError('')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('')

        const additionalLang = formData.translations?.map((translation) => translation.lang)
        // console.log('additionalLang', (new Set(additionalLang)).size);

        if (additionalLang.length > (new Set(additionalLang)).size) {
            setValidationError("Bot command cannot have two translations with the same language.");
            return;
        }
        // Initialize payloads with Main English values
        const textsPayload = { en: formData.text };
        const triggersPayload = { en: formData.trigger };

        // Merge Translations into the payload objects
        formData.translations.forEach(item => {
            if (item.lang) {
                textsPayload[item.lang] = item.text;
                triggersPayload[item.lang] = item.trigger;
            }
        });

        const dataToSend = {
            id: formData.id,
            keyword: formData.keyword,
            description: formData.description,
            texts: textsPayload,
            triggers: triggersPayload,
            nextKeywords: formData?.nextKeywords
        }
        // console.log("Form Data: ", formData, dataToSend);

        if (isEditMode) {
            // UPDATE LOGIC
            updateMutation.mutate({ data: dataToSend }, {
                onSuccess: () => navigate('/admin/bot-commands'),
                onError: (err) => console.error("Update failed", err)
            });
        } else {
            // CREATE LOGIC
            createMutation.mutate(dataToSend, {
                onSuccess: () => navigate('/admin/bot-commands'),
                onError: (err) => console.error("Create failed", err)
            });
        }
    };

    // Show Loading screen while fetching initial data for Edit
    if (isEditMode && isLoadingData) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading bot command details...</p>
            </div>
        );
    }

    // Show Error if fetching failed
    if (isEditMode && isFetchError) {
        return <Alert variant="danger">Error loading bot command details.</Alert>;
    }
  return (
    <>
        <Form className='entry-form' onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="title-wrapper d-flex">
                    <Button 
                        className='me-2' 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => navigate(`/admin/bot-commands`)}
                        disabled={isPending}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <h4>Add bot command</h4>
                </div>
                <div className="actions-wrapper">
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? (
                                <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                />
                            ) : (
                                <i className="bi pe-none bi-floppy2-fill"></i>
                            )
                        }
                    </Button>
                </div>
            </div>
            <div className="scrollable-container">

                {(createMutation.isError || updateMutation.isError) && (
                    <Alert variant="danger">
                        Failed to save bot command : {error?.message}
                    </Alert>
                )}

                {validationError && <Alert variant="danger" dismissible onClose={() => setValidationError('')}>{validationError}</Alert>}

                <Form.Group className="mb-3" controlId="formGridKeyword">
                    <Form.Label>Keyword</Form.Label>
                    <Form.Control 
                        name="keyword"
                        type="text" 
                        placeholder="Enter keyword" 
                        value={formData.keyword}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as={TextareaAutosize}
                        name="description" 
                        minRows={3}
                        maxRows={15}
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className="d-block mb-2">Next Possible Keywords</Form.Label>
                    
                    {isLoadingList ? (
                        <Spinner size="sm" animation="border" />
                    ) : (
                        <div className="border rounded p-3 bg-white" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {botCommands?.map((cmd) => (
                                <Form.Check 
                                    key={cmd.id}
                                    type="checkbox"
                                    id={`chk-${cmd.keyword}`}
                                    label={
                                        <div className='d-flex align-items-start flex-column'>
                                            <Badge bg="secondary" className="me-2">{cmd.keyword}</Badge>
                                            <small className="text-muted">{cmd.triggers['en'] || ''}</small>
                                        </div>
                                    }
                                    className="mb-2"
                                    // Don't allow selecting self as next step (prevent infinite loops)
                                    disabled={cmd.keyword === formData.keyword}
                                    checked={formData.nextKeywords.includes(cmd.keyword)}
                                    onChange={() => handleNextKeywordChange(cmd.keyword)}
                                />
                            ))}
                            {(!botCommands || botCommands.length === 0) && <small>No other commands found.</small>}
                        </div>
                    )}
                    <Form.Text className="text-muted">
                        Select which commands the user can trigger after this one.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridTrigger">
                    <Form.Label>Trigger</Form.Label>
                    <Form.Control 
                        name="trigger"
                        type="text" 
                        placeholder="Enter trigger" 
                        value={formData.trigger}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridText">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as={TextareaAutosize}
                        name="text" 
                        minRows={3}
                        maxRows={15}
                        placeholder="Enter text"
                        value={formData.text}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>


                <div className="children-wrapper">
                    {formData?.translations?.map((translation, index) => (
                        <Card className='child-card mb-3' key={index} >
                            <Card.Header className='d-flex align-items-center justify-content-between'>
                                <span>Translation #{index + 1}</span>

                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleChildDelete(index)}
                                >
                                    <i className="bi pe-none bi-trash-fill"></i>
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                <Form.Label>Language</Form.Label>
                                    <Form.Select
                                        name="lang"
                                        value={translation.lang}
                                        onChange={(e) => handleTranslationChange(index, 'lang', e.target.value)}
                                        disabled={isPending}
                                    >
                                        <option value="en">English</option>
                                        <option value="ar">Arabic</option>
                                        <option value="fr">French</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Trigger</Form.Label>
                                    <Form.Control 
                                        name="trigger"
                                        type="text" 
                                        placeholder="Enter trigger" 
                                        value={translation.trigger}
                                        onChange={(e) => handleTranslationChange(index, 'trigger', e.target.value)}
                                        disabled={isPending}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Text</Form.Label>
                                    <Form.Control
                                        as={TextareaAutosize}
                                        name="text" 
                                        minRows={3}
                                        maxRows={15}
                                        placeholder="Enter text"
                                        value={translation.text}
                                        onChange={(e) => handleTranslationChange(index, 'text', e.target.value)}
                                        disabled={isPending}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                <Button 
                    variant="outline-primary" 
                    size="sm" 
                    disabled={isPending}
                    onClick={handleAddTranslation}
                >
                    Add Translation
                </Button>
            </div>
        </Form>
    </>
  )
}

export default BotCommandsEntry